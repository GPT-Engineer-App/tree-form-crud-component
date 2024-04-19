import React, { useState } from "react";
import { Box, Button, Input, VStack, HStack, Text, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";

const Index = () => {
  const [treeData, setTreeData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const toast = useToast();

  const handleAddNode = (parentId = null) => {
    if (!inputValue.trim()) {
      toast({
        title: "Error",
        description: "Input can't be empty",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newNode = {
      id: Math.random().toString(36).substr(2, 9),
      name: inputValue,
      children: [],
      parentId,
    };

    if (parentId) {
      const updateTree = (nodes) =>
        nodes.map((node) => {
          if (node.id === parentId) {
            return { ...node, children: [...node.children, newNode] };
          } else if (node.children.length) {
            return { ...node, children: updateTree(node.children) };
          }
          return node;
        });

      setTreeData(updateTree(treeData));
    } else {
      setTreeData([...treeData, newNode]);
    }

    setInputValue("");
    setSelectedNode(null);
  };

  const handleSelectNode = (node) => {
    if (!editMode) {
      setSelectedNode(node);
      setInputValue(node.name);
    }
  };

  const handleDeleteNode = (id) => {
    const deleteNode = (nodes) =>
      nodes.filter((node) => {
        if (node.id === id) return false;
        if (node.children.length) node.children = deleteNode(node.children);
        return true;
      });

    setTreeData(deleteNode(treeData));
    setSelectedNode(null);
    setInputValue("");
  };

  const handleEditNode = () => {
    if (!inputValue.trim()) {
      toast({
        title: "Error",
        description: "Input can't be empty",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const updateNode = (nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNode.id) {
          return { ...node, name: inputValue };
        } else if (node.children.length) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });

    setTreeData(updateNode(treeData));
    setEditMode(false);
    setSelectedNode(null);
    setInputValue("");
  };

  const renderTree = (nodes, depth = 0) =>
    nodes.map((node) => (
      <VStack key={node.id} align="start">
        <HStack>
          <Text pl={`${depth * 20}px`} onClick={() => handleSelectNode(node)} cursor="pointer">
            {node.name}
          </Text>
          <IconButton icon={<FaTrash />} size="sm" onClick={() => handleDeleteNode(node.id)} />
        </HStack>
        {node.children.length > 0 && renderTree(node.children, depth + 1)}
      </VStack>
    ));

  return (
    <Box p={5}>
      <VStack spacing={4}>
        <Input placeholder="Enter node name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <HStack>
          {editMode ? (
            <Button leftIcon={<FaSave />} onClick={handleEditNode}>
              Save Edit
            </Button>
          ) : (
            <Button leftIcon={<FaPlus />} onClick={() => handleAddNode(selectedNode?.id)}>
              Add Node
            </Button>
          )}
          {selectedNode && !editMode && (
            <Button leftIcon={<FaEdit />} onClick={() => setEditMode(true)}>
              Edit Node
            </Button>
          )}
        </HStack>
        <Box w="full" p={5} borderWidth="1px" borderRadius="lg">
          {renderTree(treeData)}
        </Box>
        <Box w="full" p={5} borderWidth="1px" borderRadius="lg" overflow="auto">
          <pre>{JSON.stringify(treeData, null, 2)}</pre>
        </Box>
      </VStack>
    </Box>
  );
};

export default Index;
